import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';
import { Repository } from 'typeorm';
import { CreateSubDto } from './dto/create-sub.dto';
import { UpdateSubDto } from './dto/update-sub.dto';
import { Sub } from './entities/sub.entity';

@Injectable()
export class SubService {
  constructor(
    @InjectRepository(Sub)
    private subRepository: Repository<Sub>,
  ) {}

  create(createSubDto: CreateSubDto) {
    return this.subRepository.create(createSubDto);
  }

  async save(sub: Sub) {
    return await this.subRepository.save(sub);
  }

  async subExists(name: string) {
    const sub = await this.subRepository
      .createQueryBuilder('sub')
      .where('lower(sub.name) = :name', { name: name.toLowerCase() })
      .getOne();
    return sub;
  }

  async getTopSubs() {
    const imageUrlExpression = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn" ,
    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;
    const subs = await this.subRepository
      .createQueryBuilder()
      .select(
        `s.title, s.name, ${imageUrlExpression} as "imageUrl", count(p.id) as "postCount"`,
      )
      .from(Sub, 's') //Sub tablet s-nek fogjuk hivni a queryben!!!
      .leftJoin(Post, 'p', `s.name = p."subName"`)
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy(`"postCount"`, 'DESC')
      .limit(5)
      .execute();

    return subs;
  }

  findAll() {
    return this.subRepository.find();
  }

  async findOne(name: string) {
    const sub = await this.subRepository.findOneOrFail({ name });
    await sub.getUrls();
    return sub;
  }

  findOneOrFail(updateSubDto: UpdateSubDto) {
    return this.subRepository.findOneOrFail(updateSubDto);
  }

  update(name: string, updateSubDto: UpdateSubDto) {
    return this.subRepository.update({ name }, updateSubDto);
  }

  async remove(sub: Sub) {
    return this.subRepository.remove(sub);
  }

  searchSubs(name: string) {
    return (
      this.subRepository
        .createQueryBuilder()
        .where('LOWER(name) LIKE :name', {
          name: `${name.toLowerCase().trim()}%`,
        }) // %jelek kellenek ha valamiben pontosan ezt a szovegdarabot keressuk
        // ha csak a vegen van % jel akkor nem nezi, hogy a szovegunkkel kell vegzodnie, csak kezdodnie!!!! Ezert irtam csak a vegere, mert keresesben az elejetol esszeru nezni
        .getMany()
    );
  }
}
