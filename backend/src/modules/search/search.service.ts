import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../articles/entities/article.entity';
import { Page } from '../pages/entities/page.entity';
import { Event } from '../events/entities/event.entity';
import { AdmissionPost } from '../admissions/entities/admission-post.entity';

export interface SearchResult {
  id: string;
  type: 'article' | 'page' | 'event' | 'admission';
  title: string;
  description: string | null;
  slug: string;
  thumbnail_url: string | null;
  category: string;
  date: string;
  created_at: Date;
}

/** Strip HTML tags va truncate noi dung thanh excerpt */
function stripHtmlAndTruncate(html: string | null, maxLen = 150): string | null {
  if (!html) return null;
  // Xoa tat ca HTML tags
  const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
}

/** Format date thanh dd/mm/yyyy cho hien thi */
function formatDate(date: Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Tim kiem toan cuc — search across articles, pages, events, admissions.
 * Chi tra ve cac item da PUBLISHED.
 * Sort: title match truoc, roi theo ngay moi nhat.
 */
@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Article) private readonly articleRepo: Repository<Article>,
    @InjectRepository(Page) private readonly pageRepo: Repository<Page>,
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    @InjectRepository(AdmissionPost) private readonly admissionRepo: Repository<AdmissionPost>,
  ) {}

  async search(q: string, type?: string, page = 1, limit = 12) {
    if (!q || q.trim().length < 2) {
      throw new BadRequestException('Tu khoa tim kiem phai co it nhat 2 ky tu');
    }

    const keyword = q.trim();
    const offset = (page - 1) * limit;
    const safeLimit = Math.min(limit, 50);

    const results: SearchResult[] = [];

    const types = type ? [type] : ['article', 'page', 'event', 'admission'];

    // Chay song song cac query
    const promises: Promise<void>[] = [];

    if (types.includes('article')) {
      promises.push(this.searchArticles(keyword).then((items) => {
        results.push(...items);
      }));
    }

    if (types.includes('page')) {
      promises.push(this.searchPages(keyword).then((items) => {
        results.push(...items);
      }));
    }

    if (types.includes('event')) {
      promises.push(this.searchEvents(keyword).then((items) => {
        results.push(...items);
      }));
    }

    if (types.includes('admission')) {
      promises.push(this.searchAdmissions(keyword).then((items) => {
        results.push(...items);
      }));
    }

    await Promise.all(promises);

    // Sort: title match xep truoc (relevance), roi theo ngay moi nhat
    const kwLower = keyword.toLowerCase();
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(kwLower) ? 1 : 0;
      const bTitleMatch = b.title.toLowerCase().includes(kwLower) ? 1 : 0;
      if (aTitleMatch !== bTitleMatch) return bTitleMatch - aTitleMatch;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const total = results.length;

    // Phan trang tren ket qua da merge
    const paged = results.slice(offset, offset + safeLimit);

    return {
      success: true,
      data: paged,
      message: 'OK',
      pagination: {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  private async searchArticles(keyword: string): Promise<SearchResult[]> {
    const items = await this.articleRepo
      .createQueryBuilder('a')
      .select(['a.id', 'a.title', 'a.slug', 'a.excerpt', 'a.content', 'a.thumbnail_url', 'a.published_at', 'a.created_at'])
      .where('a.status = :status', { status: 'published' })
      .andWhere('a.deleted_at IS NULL')
      .andWhere('(a.title LIKE :kw OR a.excerpt LIKE :kw OR a.content LIKE :kw)', { kw: `%${keyword}%` })
      .orderBy('a.created_at', 'DESC')
      .limit(50)
      .getMany();

    return items.map((a) => ({
      id: a.id,
      type: 'article' as const,
      title: a.title,
      description: a.excerpt || stripHtmlAndTruncate(a.content),
      slug: a.slug,
      thumbnail_url: a.thumbnail_url,
      category: 'Bài viết',
      date: formatDate(a.published_at || a.created_at),
      created_at: a.created_at,
    }));
  }

  private async searchPages(keyword: string): Promise<SearchResult[]> {
    const items = await this.pageRepo
      .createQueryBuilder('p')
      .select(['p.id', 'p.title', 'p.slug', 'p.content', 'p.created_at'])
      .where('p.status = :status', { status: 'published' })
      .andWhere('p.deleted_at IS NULL')
      .andWhere('(p.title LIKE :kw OR p.content LIKE :kw)', { kw: `%${keyword}%` })
      .orderBy('p.created_at', 'DESC')
      .limit(20)
      .getMany();

    return items.map((p) => ({
      id: p.id,
      type: 'page' as const,
      title: p.title,
      description: stripHtmlAndTruncate(p.content),
      slug: p.slug,
      thumbnail_url: null,
      category: 'Trang',
      date: formatDate(p.created_at),
      created_at: p.created_at,
    }));
  }

  private async searchEvents(keyword: string): Promise<SearchResult[]> {
    const items = await this.eventRepo
      .createQueryBuilder('e')
      .select(['e.id', 'e.title', 'e.description', 'e.image_url', 'e.start_date', 'e.created_at'])
      .where('e.deleted_at IS NULL')
      .andWhere('(e.title LIKE :kw OR e.description LIKE :kw)', { kw: `%${keyword}%` })
      .orderBy('e.created_at', 'DESC')
      .limit(20)
      .getMany();

    return items.map((e) => ({
      id: e.id,
      type: 'event' as const,
      title: e.title,
      description: e.description,
      slug: e.id, // Events khong co slug
      thumbnail_url: e.image_url,
      category: 'Sự kiện',
      date: formatDate(e.start_date || e.created_at),
      created_at: e.created_at,
    }));
  }

  private async searchAdmissions(keyword: string): Promise<SearchResult[]> {
    const items = await this.admissionRepo
      .createQueryBuilder('a')
      .select(['a.id', 'a.title', 'a.slug', 'a.content', 'a.thumbnail_url', 'a.published_at', 'a.created_at'])
      .where('a.status = :status', { status: 'published' })
      .andWhere('a.deleted_at IS NULL')
      .andWhere('(a.title LIKE :kw OR a.content LIKE :kw)', { kw: `%${keyword}%` })
      .orderBy('a.created_at', 'DESC')
      .limit(20)
      .getMany();

    return items.map((a) => ({
      id: a.id,
      type: 'admission' as const,
      title: a.title,
      description: stripHtmlAndTruncate(a.content),
      slug: a.slug,
      thumbnail_url: a.thumbnail_url,
      category: 'Tuyển sinh',
      date: formatDate(a.published_at || a.created_at),
      created_at: a.created_at,
    }));
  }
}
