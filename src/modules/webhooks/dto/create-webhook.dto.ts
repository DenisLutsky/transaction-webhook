import { IsUrl } from 'class-validator';

export class CreateWebhookDto {
  @IsUrl()
  public url: string;
}
