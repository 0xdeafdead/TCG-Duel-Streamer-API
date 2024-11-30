import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Channel } from '../types';
import { StartMatchInput } from './DTOs/StartMatchInput.dto';


@Injectable()
export class MatchService {
    constructor(private readonly httpService: HttpService) { }

    startMatch(input: StartMatchInput): Observable<Channel> {
        return this.httpService.post<Channel>(
            `${process.env.DISCORD_API_URL}/guilds/${process.env.SERVER_ID}/channels`,
            {
                name: input.name,
                type: 2,
                parent_id: input.category
            },
            {
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
                }
            }
        ).pipe(
            map((channelCreated) => {
                console.log('channelCreated', channelCreated)
                return channelCreated.data
            }),
            catchError((err) => {
                console.log('err', err)
                return throwError(() => new InternalServerErrorException())
            })
        )
    }
}
