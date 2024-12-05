import { Body, Controller, Get, Post } from '@nestjs/common';
import { MatchService } from './match.service';
import { Observable } from 'rxjs';
import { StartMatchInput } from './DTOs/StartMatchInput.dto';
import { GatewayData } from 'src/types';

@Controller('match')
export class MatchController {
    constructor(private readonly service: MatchService) { }

}
