// src/lib/scraper.ts (MODIFIKASI)

import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TARGET_URL = 'https://www-bankbazaar-com.translate.goog/commodity-price/palm-oil-price.html?_x_tr_sl=en&_x_tr_tl=id&_x_tr_hl=id&_x_tr_pto=rq'; // Pastikan ini sudah diganti
const DATA_SOURCE_NAME = 'NAMA_SITUS_SUMBER'; // Pastikan ini sudah diganti

export async function scrapeAndSavePrice() {
  try {
    console.log(`Memulai scraping dari ${TARGET_URL}...`);

    // --- TAMBAHKAN HEADERS DI SINI ---
    const axiosOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Connection': 'keep-alive'
      }
    };

    // Gunakan opsi pada panggilan axios.get
    const { data } = await axios.get(TARGET_URL, axiosOptions);
    // ------------------------------------

    const $ = cheerio.load(data);

    // Sesuaikan selector ini dengan situs target Anda
    const priceText = $('.harga-terkini').text(); 

    if (!priceText) {
      throw new Error('Elemen harga tidak ditemukan. Periksa kembali selector Cheerio Anda.');
    }

    const priceNumber = parseFloat(
      priceText.replace('Rp', '').replace(/\./g, '').replace(',', '.')
    );

    if (isNaN(priceNumber)) {
      throw new Error('Gagal mengonversi teks harga menjadi angka.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const savedPrice = await prisma.palmOilPrice.upsert({
      where: { date: today },
      update: { price: priceNumber },
      create: {
        date: today,
        price: priceNumber,
        source: DATA_SOURCE_NAME,
      },
    });

    console.log('Harga berhasil disimpan ke database:', savedPrice);
    return savedPrice;

  } catch (error) {
    console.error('Terjadi kesalahan saat scraping:', error);
    throw error;
  }
}