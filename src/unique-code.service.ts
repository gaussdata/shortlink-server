import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EntityManager } from 'typeorm';
import { blockWords, generateRandomStr } from './utils';
import { UniqueCode } from './entities/UniqueCode';

@Injectable()
export class UniqueCodeService {

    @InjectEntityManager()
    private entityManager: EntityManager;

    /**
     * 凌晨 4 点左右批量插入 10000 条数据
     */
    @Cron(CronExpression.EVERY_DAY_AT_4AM)
    async batchGenerateCode() {
        for (let i = 0; i < 10000; i++) {
            this.generateCode();
        }
    }

    /**
     * 生成唯一编码 格式为 6 位 62 进制数。
     * 理论上最多 62 ^ 6 条数据 56800235584，即 568 亿
     * @returns 
     */

    async generateCode() {
        const str = generateRandomStr(6);

        // 屏蔽关键词，包含屏蔽词，重新生成
        if (blockWords.some(word => str.toLowerCase().includes(word))) {
            return this.generateCode();
        }

        // 检查是不是已经存在了，已存在，重新生成
        const uniqueCode = await this.entityManager.findOneBy(UniqueCode, {
            code: str
        });

        if (uniqueCode) {
            return this.generateCode();
        }

        const code = new UniqueCode();
        code.code = str;
        code.status = 0;
        return await this.entityManager.insert(UniqueCode, code);
    }
}