import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';

import { CustomRequest } from 'shared/interfaces';
import { CreateWebhookDto } from '../dto';
import { WebhooksService } from '../services';
import { AuthGuard } from 'shared/guards';

@UseGuards(AuthGuard)
@Controller('webhooks')
export class WebhooksController {
  public constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  public async registerWebhook(@Req() { user }: CustomRequest, @Body() input: CreateWebhookDto): Promise<void> {
    await this.webhooksService.createWebhook({ ...input, user });
  }
}
