import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'time'
})

export class TimePipe implements PipeTransform {
    transform(value: number): string {
        let minutes = Math.floor(value / 60);
        let seconds = (value - minutes * 60);
        if (seconds === 0) {
            return minutes + ':' + seconds + '0';
        } else if (seconds < 10) {
            return minutes + ':0' + seconds;
        }
        return minutes + ':' + seconds;
    }
}