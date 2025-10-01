import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AiService {
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private readonly httpService: HttpService) {}

  async generateResponse(prompt: string): Promise<string> {
    const response$ = this.httpService.post(
      this.baseUrl,
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const response = await lastValueFrom(response$);
    return response.data.choices[0].message.content;
  }
}