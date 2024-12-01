import { Body, Controller, Get, Post } from '@nestjs/common';
import { MatchService } from './match.service';
import { Channel } from 'src/types/Channel';
import { Observable } from 'rxjs';
import { StartMatchInput } from './DTOs/StartMatchInput.dto';
import { GatewayData } from 'src/types';

@Controller('match')
export class MatchController {
    constructor(private readonly service: MatchService) { }

    @Post()
    createNewVoiceChannel(@Body("input") input: StartMatchInput): Observable<string> {
        return this.service.startMatch(input);
    }

    @Get()
    getBotGateway(): Observable<GatewayData> {
        return this.service.startVoiceConnections();
    }
}
