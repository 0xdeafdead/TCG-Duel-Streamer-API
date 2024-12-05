import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Channel, GatewayData } from '../types';
import { StartMatchInput } from './DTOs/StartMatchInput.dto';


@Injectable()
export class MatchService {
    constructor(private readonly httpService: HttpService) { }



    // STAGNANT UNTIL FIND A WAY TO STREAM VIDEO OR GET OBS INTO DOCKER AND ACCESS IT DINAMICALLY 
    // startMatch(input: StartMatchInput) {

    //     return forkJoin([this.createVoiceChannel(input), this.startVoiceConnections()]).pipe(
    //         switchMap(async ([newChannel, gatewayData]) => {
    //             const gateway = { ...gatewayData, url: gatewayData.url + "?v=8" };

    //             return of({ channel: newChannel, gateway });
    //         }), catchError((err) => {
    //             console.log('err', err)
    //             return throwError(() => new InternalServerErrorException(err.message))
    //         })
    //     )
    // }

    // createVoiceChannel(input: StartMatchInput): Observable<Channel> {
    //     return this.httpService.post<Channel>(
    //         `${process.env.DISCORD_API_URL}/guilds/${process.env.SERVER_ID}/channels`,
    //         {
    //             name: input.name,
    //             type: 2,
    //             parent_id: input.category
    //         },
    //         {
    //             headers: {
    //                 Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
    //             }
    //         }
    //     ).pipe(
    //         map((channelCreated) => {
    //             console.log('channelCreated', channelCreated.data)
    //             return channelCreated.data
    //         }),
    //         catchError((err) => {
    //             console.log('err', err)
    //             return throwError(() => new InternalServerErrorException())
    //         })
    //     )
    // }

    // startVoiceConnections(): Observable<GatewayData> {
    //     return this.httpService.get<GatewayData>(`${process.env.DISCORD_API_URL}/gateway/bot`, {
    //         headers: {
    //             Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
    //         }
    //     }).pipe(
    //         map((res) => {
    //             console.log('data', res.data)
    //             return res.data;
    //         }),
    //         catchError((err) => {
    //             console.log('err', err)
    //             return throwError(() => new InternalServerErrorException(err.message))
    //         })
    //     )
    // }
}
