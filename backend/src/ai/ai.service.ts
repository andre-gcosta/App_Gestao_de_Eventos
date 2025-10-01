import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as chrono from 'chrono-node';

@Injectable()
export class AiService {
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private readonly httpService: HttpService) {}

  // Gera resposta textual da IA
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

  // Extrai dados do evento do prompt, incluindo conversão de datas
  async extractEventData(prompt: string): Promise<{
    title: string;
    description: string | null;
    location: string;
    status: string;
    startDate: string;
    endDate: string;
  }> {
    // Inclui data atual para a IA interpretar "amanhã", "segunda-feira", etc.
    const today = new Date().toISOString().split('T')[0];

    const systemMessage = `
Você é um assistente que cria eventos de calendário.
Hoje é ${today} (YYYY-MM-DD).
Extraia do texto abaixo os campos para criar um evento no seguinte formato JSON:
{
  "title": "",
  "description": "",
  "location": "",
  "status": "scheduled",
  "startDate": "YYYY-MM-DDTHH:MM:SS-03:00",
  "endDate": "YYYY-MM-DDTHH:MM:SS-03:00"
}
Considere que todos os horários estão em Brasília (UTC-3) e retorne somente JSON.
`;

    const response$ = this.httpService.post(
      this.baseUrl,
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt },
        ],
        max_tokens: 300,
      },
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      },
    );

    const response = await lastValueFrom(response$);
    const content = response.data.choices[0].message.content;

    // Extrai JSON válido (remove texto adicional)
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Falha ao interpretar resposta da IA');

    const eventData = JSON.parse(match[0]);

    // Converte startDate e endDate para UTC
    const startDate = chrono.parseDate(eventData.startDate, new Date(), { forwardDate: true });
    const endDate = chrono.parseDate(eventData.endDate, new Date(), { forwardDate: true });

    if (!startDate || !endDate) throw new Error('Não foi possível interpretar datas');

    return {
      title: eventData.title || 'Sem título',
      description: eventData.description || null,
      location: eventData.location || 'Sem local definido',
      status: eventData.status || 'scheduled',
      startDate: startDate.toISOString(), // UTC
      endDate: endDate.toISOString(),     // UTC
    };
  }
}
