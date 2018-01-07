import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonService } from '../services/common.service';
import { RoomService } from '../services/room.service';

@Component({
    selector: 'lobby',
    templateUrl: 'lobby.component.html'
})

export class LobbyComponent implements OnInit {
    roomCode: string;
    players: string[] = [];
    time = 8;
    socket;
    isHost: boolean = false;

    constructor(private roomService: RoomService, 
                private router: Router, 
                private activatedRoute: ActivatedRoute,
                private commonService: CommonService) {

        this.roomService.listen('invalid-room').subscribe(() => {
            this.router.navigateByUrl('/play').then(() => {
                window.alert('Room does not exist.');
            });
        });
        this.roomService.listen('full-room').subscribe(() => {
            this.router.navigateByUrl('/play/join').then(() => {
                window.alert('Room is full.');
            });
        });
        this.roomService.listen('invalid-name').subscribe(() => {
            this.router.navigateByUrl('/play/join').then(() => {
                window.alert('Room does not exist.');
            });
        });
        this.roomService.listen('existing-player').subscribe(() => {
            this.router.navigateByUrl('/play/join').then(() => {
                window.alert('Player already exists.');
            });
        });
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            this.roomService.joinRoom({
                roomCode: params['roomCode'],
                name: this.commonService.name
            });
        });

        this.roomService.listen('joined-room').subscribe((data) => {
            this.roomCode = data.roomCode;
            this.players = data.players;  
                        
            // first player is always host
            if (this.players.length > 0) {
                if (this.players[0] === this.commonService.name) {
                    this.isHost = true;
                }
            }            
        });

        this.roomService.listen('player-left').subscribe((data) => {
            this.players = data.players;
            if (this.players.length > 0) {
                console.log(this.players[0]);
                if (this.players[0] === this.commonService.name) {
                    this.isHost = true;
                }
            }   
        });

        this.roomService.listen('update-time').subscribe((time) => {
            this.time = time;
        });

        this.roomService.listen('starting-game').subscribe(() => {
            this.router.navigateByUrl('/play/' + this.roomCode + '/module');
        });
    }

    startGame() {
        this.roomService.listen('insufficient-players').subscribe((data) => {
            if (data) {
                window.alert('There are not enough players.');
            } else {
                this.router.navigateByUrl('/play/' + this.roomCode + '/module');
            }
        });
        this.roomService.startGame();
    }

    leaveLobby() {
        this.roomService.leaveRoom({
            roomCode: this.roomCode,
            name: this.commonService.name
        });
        this.router.navigateByUrl('/play/join').then(() => {
            location.reload();
        });
    }

    updateTime(time) {
        this.time = time;
        this.roomService.changeTime(time);
    }
}