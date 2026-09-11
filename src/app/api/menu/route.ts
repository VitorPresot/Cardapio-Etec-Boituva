import { NextResponse } from 'next/server';
import { initialWeeks } from '@/data/initialData';
import { Week } from '@/types/menu';
import fs from 'fs';
import path from 'path';

// Arquivo temporário para persistência em servidor ou ambiente local
const TMP_FILE = path.join('/tmp', 'etec_cardapio_data.json');

// Memória em runtime
let cachedWeeks: Week[] = initialWeeks;

function loadServerWeeks(): Week[] {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedWeeks = parsed;
        return parsed;
      }
    }
  } catch {
    // fallback para cached
  }
  return cachedWeeks;
}

function saveServerWeeks(weeks: Week[]): void {
  cachedWeeks = weeks;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(weeks, null, 2), 'utf-8');
  } catch {
    // se falhar em ambiente read-only, cachedWeeks na memória ainda funciona
  }
}

export async function GET() {
  const weeks = loadServerWeeks();
  return NextResponse.json({
    success: true,
    weeks,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !Array.isArray(body.weeks)) {
      return NextResponse.json(
        { success: false, error: 'Formato de dados inválido' },
        { status: 400 }
      );
    }

    saveServerWeeks(body.weeks);

    return NextResponse.json({
      success: true,
      message: 'Cardápio atualizado com sucesso',
      weeks: body.weeks,
    });
  } catch (error) {
    console.error('Erro na API /api/menu:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao salvar cardápio' },
      { status: 500 }
    );
  }
}

