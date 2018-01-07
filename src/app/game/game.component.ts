import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { TimePipe } from '../pipes/time.pipe';
import { RoomService } from '../services/room.service';
import { CommonService } from '../services/common.service';

import * as locations from '../locations.json';

@Component({
    selector: 'game',
    templateUrl: './game.component.html'
})

export class GameComponent implements OnInit {
    location: string = '???';
    role: string = '???';
    time = 0;
    roleModalRef: BsModalRef;

    constructor(private roomService: RoomService, 
                private modalService: BsModalService,
                private commonService: CommonService) { }

    ngOnInit() {
        this.roomService.listen('time-count').subscribe((time) => {
            this.time = time;
        });

        this.roomService.getGameInfo().subscribe((data: any) => {
            if (data != null) {
                let playerIndex = data.players.indexOf(this.commonService.name);                
                if (data.info.roles[playerIndex] !== 'Spy') {
                    this.location = this.roomService.getLocation(data.info.locIndex).display;
                }
                this.role = data.info.roles[playerIndex];
            }
        });

        this.roomService.getIsGameOver().subscribe((data) => {
            if (data) {
                this.time = 0;

                window.alert('Time is up.');
            }
        });
    }

    showRole(roleTemplate: TemplateRef<any>) {
        this.roleModalRef = this.modalService.show(roleTemplate);
    }
}