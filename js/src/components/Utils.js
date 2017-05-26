/**
 * Created by 1 on 03.01.2017.
 */
export class Utils{
    constructor(){}

    static get0delta(array){
        var i = 0;
        var minDiff = 1000;
        var ans;
        for(i in array)
        {
            var m = Math.abs(0 - array[i].y);
            if(m < minDiff)
            {
                minDiff = m;
                ans = array[i].y;
            }
        }
        return ans;
    }
}

