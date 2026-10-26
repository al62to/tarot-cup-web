// /tr/llms.txt auf Türkisch (Inhalt in src/daten/llms.mjs).
import { llmsText } from '../../daten/llms.mjs';

export function GET() {
  return new Response(llmsText('tr'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
