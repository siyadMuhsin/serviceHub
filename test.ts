class Parant{
    constructor(){

    }
    fly(){
        console.log('bird flying')
    }
}
class Child extends Parant{
    // constructor(){
    //     // super()
    // }
    // fly(){
    //     console.log('flying another');
        
    // }
}
const test=new Child()
test.fly()