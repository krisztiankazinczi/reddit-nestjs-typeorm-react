import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
