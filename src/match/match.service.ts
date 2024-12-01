import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, EMPTY, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Channel, GatewayData } from '../types';
import { StartMatchInput } from './DTOs/StartMatchInput.dto';


@Injectable()
export class MatchService {
    constructor(private readonly httpService: HttpService) { }

    startMatch(input: StartMatchInput) {
        return forkJoin([this.createVoiceChannel(input), this.startVoiceConnections()]).pipe(
            switchMap(([newChannel, gatewayData]) => {
                const voiceStatusSocket = new WebSocket(gatewayData.url);
                voiceStatusSocket.onopen = event => {
                    voiceStatusSocket.send(JSON.stringify({ op: 4, d: { guild_id: process.env.SERVER_ID, channel_id: newChannel.id, self_mute: false, self_deaf: false } }))
                }
                let isReady = 2
                let voiceConnectionSocket: WebSocket;
                let sessionId: string;
                let endpoint: "wss://";
                let token: string;
                voiceStatusSocket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    console.log(event);
                    console.log("event data", data);
                    if (data.t === "VOICE_SERVER_UPDATE") {
                        token = data.token;
                        endpoint += data.endpoint;
                        isReady--;
                    }
                    if (data.t === "VOICE_STATE_UPDATE") {
                        sessionId = data.session_id;
                        isReady--;
                    }
                    if (isReady === 0) {
                        voiceConnectionSocket = new WebSocket(endpoint);
                        voiceConnectionSocket.onopen = event => {
                            voiceConnectionSocket.send(JSON.stringify({
                                op: 0, d: {
                                    server_id: process.env.SERVER_ID,
                                    user_id: "1311844705063141486",
                                    session_id: sessionId,
                                    token
                                }
                            }))
                        }

                        voiceConnectionSocket.onmessage = event => {
                            const data = event.data;
                            console.log('data', data)
                        }
                    }
                }

                return of("testing");
            }), catchError((err) => {
                console.log('err', err)
                return throwError(() => new InternalServerErrorException(err.message))
            })
        )
    }

    createVoiceChannel(input: StartMatchInput): Observable<Channel> {
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
                console.log('channelCreated', channelCreated.data)
                return channelCreated.data
            }),
            catchError((err) => {
                console.log('err', err)
                return throwError(() => new InternalServerErrorException())
            })
        )
    }

    startVoiceConnections(): Observable<GatewayData> {
        return this.httpService.get<GatewayData>(`${process.env.DISCORD_API_URL}/gateway/bot`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
            }
        }).pipe(
            map((res) => {
                console.log('data', res.data)
                return res.data;
            }),
            catchError((err) => {
                console.log('err', err)
                return throwError(() => new InternalServerErrorException(err.message))
            })
        )
    }
}
