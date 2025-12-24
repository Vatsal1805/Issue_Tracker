const ApiError=require('../errors/Apierror');

class RateLimiter{
    constructor(limit=100,windowMs=15*60*1000){
        this.limit=limit;
        this.windowMs=windowMs;
        this.clients=new Map();
    }

    check(key){
        const currentTime=Date.now();
        if(!this.clients.has(key)){
            this.clients.set(key,{count:1,startTime:currentTime});
            return true;
        }
        const clientData=this.clients.get(key);
        if(currentTime-clientData.startTime>this.windowMs){
            this.clients.set(key,{count:1,startTime:currentTime});
            return true;
        }

        if(clientData.count>=this.limit){
            throw new ApiError(429, 'Too many requests');
        }
        clientData.count++;
        this.clients.set(key, clientData);
        return true;
    }
}


module.exports=new RateLimiter(100,15*60*1000);