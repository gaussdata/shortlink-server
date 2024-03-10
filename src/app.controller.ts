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
   * @param  longUrl 
   * @returns  
   * @example /long?url=<your_long_url>
   */
  @Get('long')
  async generateShortUrl(@Query('url') longUrl: string) {
    return this.shortLongMapService.generate(longUrl);
  }

  /**
   * 反查长链接
   * @param code 
   * @returns 
   * @example /short?code=<your_short_code>
   */
  
  @Get('short')
  async findLongUrl(@Query('code') code) {
    const longUrl = await this.shortLongMapService.getLongUrl(code);
    if (!longUrl) {
      throw new BadRequestException('短链不存在');
    }
    return {
      url: longUrl,
      statusCode: 200
    }
  }

  /**
   * 短链接重定向到长链接
   * @param code 
   * @returns 
   * @example /6Gk3aA1
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
