import { ShortLongMapService } from './short-long-map.service';
import { BadRequestException, Controller, Get, Inject, Param, Query, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Inject(ShortLongMapService)
  private shortLongMapService: ShortLongMapService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * 生成短链接
   * @param longUrl 
   * @returns 
   */
  @Get('short')
  async generateShortUrl(@Query('url') longUrl) {
    return this.shortLongMapService.generate(longUrl);
  }

  /**
   * 短链接重定向到长链接
   * @param code 
   * @returns 
   */
  @Get(':code')
  @Redirect()
  async rediect(@Param('code') code) {
    const longUrl = await this.shortLongMapService.getLongUrl(code);
    if (!longUrl) {
      throw new BadRequestException('短链不存在');
    }
    return {
      url: longUrl,
      statusCode: 302
    }
  }

}
