/**
 * Created by Admin on 05.05.17.
 */

//, true);

export class ServiceProxy{
    constructor(){
        this.spinResponseSignal = new signals.Signal;
        this.initResponseSignal = new signals.Signal;

        this.request = new XMLHttpRequest();
    }

    sendSpinRequest(data){
        this.request.open("POST", ServiceProxy.REQUEST_URL + "spin", true);
        this.request.setRequestHeader('Content-type', 'application/json');
        this.request.onload = this.onSpinResponse.bind(this);
        this.request.onerror = this.onSpinError.bind(this);
        this.request.send(JSON.stringify(data));
    }

    onSpinResponse(){
        var result = JSON.parse(this.request.responseText);
        this.spinResponseSignal.dispatch(result);
    }

    onSpinError(){}

    //-------------------------init----------------------------------------------//

    sendInitRequest(data){
        this.request.open("POST", ServiceProxy.REQUEST_URL + "init", true);
        this.request.setRequestHeader('Content-type', 'application/json');
        this.request.onload = this.onInitResponse.bind(this);
        this.request.onerror = this.onInitError.bind(this);
        this.request.send(JSON.stringify(data));
    }

    onInitResponse(){
        var result = JSON.parse(this.request.responseText);
        this.initResponseSignal.dispatch(result);
    }

    onInitError(){}
}

ServiceProxy.REQUEST_URL = //"http://localhost:8080/";
    "http://nodejs-mongo-persistent-test-project-cankillah1.1d35.starter-us-east-1.openshiftapps.com/";

//"http://localhost:8080/";
