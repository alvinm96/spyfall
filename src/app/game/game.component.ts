import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ActivatedRoute, Router } from '@angular/router';

import { TimePipe } from '../pipes/time.pipe';
import { RoomService } from '../services/room.service';
import { CommonService } from '../services/common.service';

import { environment } from '../../environments/environment';
import * as locations from '../locations.json';

@Component({
    selector: 'game',
    templateUrl: './game.component.html'
})

export class GameComponent implements OnInit {
    isHost: boolean = false;
    location: string = '???';
    role: string = '???';
    time = 0;
    roleModalRef: BsModalRef;
    locationsArr: string[] = [];
    room: string;

    constructor(private roomService: RoomService, 
                private modalService: BsModalService,
                private commonService: CommonService,
                private activatedRoute: ActivatedRoute,
                private router: Router) { }

    ngOnInit() {
        this.getLocations();
        
        this.roomService.listen('time-count').subscribe((time) => {
            this.time = time;
        });

        this.roomService.getGameInfo().subscribe((data: any) => {
            this.roomService.resetIsGameOver();

            if (data != null) {
                let playerIndex = data.players.indexOf(this.commonService.name);                
                if (data.info.roles[playerIndex] !== 'Spy') {
                    this.location = this.roomService.getLocation(data.info.locIndex).display;
                }
                this.role = data.info.roles[playerIndex];

                this.isHost = this.commonService.name === data.players[0];
            }
        });

        this.activatedRoute.params.subscribe((res: any) => {
            this.room = res.roomCode;
        })

        this.roomService.getIsGameOver().subscribe((data) => {
            if (data) {
                this.time = 0;
                window.alert('Time is up.');
                this.router.navigateByUrl('/play/' + this.room + '/lobby');
                this.role = '';
                this.location = '';
            }
        });
    }

    showRole(roleTemplate: TemplateRef<any>) {
        this.roleModalRef = this.modalService.show(roleTemplate);
    }

    endGame() {
        this.roomService.endGame();
    }

    private getLocations() {
        let numLocs = this.roomService.numLocations;
        for (let i = 0; i < numLocs; i++) {
            let loc = this.roomService.getLocation(i).display;
            this.locationsArr.push(loc);
        }
        this.locationsArr.sort();
    }
}