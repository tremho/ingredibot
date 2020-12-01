import * as DurationParser from "iso8601-duration";

import {Time, UnitType} from "unit-measure"

export class Duration {
    public iso8601:string
    public time:Time = new Time()

    constructor(iso:string) {
        this.parse(iso)
    }
    parse(str:string) {
        // had our own parse, but it sucked
        this.iso8601 = str;
        let secs = DurationParser.toSeconds(DurationParser.parse((str)))
        this.time.setValueAs(UnitType.Second, secs)
    }
}

export class Image {
    public url:string
    public width: number
    public height: number
}
