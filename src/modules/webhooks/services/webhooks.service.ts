import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import axios from 'axios';

import { Events } from 'shared/enums';
import { TransactionEventPayload, WebhookInput } from '../interfaces';
import { WebhookEntity } from '../entities';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  public constructor(
    @InjectRepository(WebhookEntity)
    private readonly webhooksRepository: EntityRepository<WebhookEntity>,
  ) {}

  public async createWebhook(input: WebhookInput): Promise<void> {
    this.logger.debug(`Creating new webhook`);

    const newWebhook = this.webhooksRepository.create({
      url: input.url,
      user: input.user,
    });

    await this.webhooksRepository.persistAndFlush(newWebhook);
  }

  @OnEvent(Events.TRANSACTION_CREATED)
  private async sendNotification(payload: TransactionEventPayload): Promise<void> {
    this.logger.debug(`Resolving "${Events.TRANSACTION_CREATED}" event`);

    const { transactionId, userId } = payload;

    const [webhook] = await this.webhooksRepository.find({ user: { userId }, isActive: true });

    if (!webhook) {
      this.logger.warn(`No active webhooks for that user`);

      return;
    }

    const { webhookId, url } = webhook;

    try {
      await axios.post(url, {
        webhookId,
        transactionId,
        event: Events.TRANSACTION_CREATED,
        time: payload.createdAt,
      });
    } catch (e) {
      if (!e.response.status) throw e;

      webhook.assign({
        isActive: false,
      });

      await this.webhooksRepository.flush();
    }
  }
}
