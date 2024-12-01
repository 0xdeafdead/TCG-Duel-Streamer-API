import { Body, Controller, Post } from '@nestjs/common';
import { MatchService } from './match.service';
import { Channel } from 'src/types/Channel';
import { Observable } from 'rxjs';
import { StartMatchInput } from './DTOs/StartMatchInput.dto';

@Controller('match')
export class MatchController {
    constructor(private readonly service: MatchService) { }

    @Post()
    createNewVoiceChannel(@Body("input") input: StartMatchInput): Observable<Channel> {
        return this.service.startMatch(input);
    }
}
