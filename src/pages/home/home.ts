import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  name:string;
  items = [];
  kush = {
    key:'',
    name:''
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
 this.GetDBData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  GetDBData(){ 
    this.items = [];
    firebase.database().ref('/kush/').on("value",(snapshot) =>{
      snapshot.forEach((snap) =>{ 
        this.kush.key = snap.key;
        this.items.push({key:snap.key, name:snap.val()});
        return false;
      })
    })
  }
  AddToCart(){
    this.items = []; 
    this.kush.name = this.name;
    var database = firebase.database();
    database.ref('/kush/').push(this.name);
    this.GetDBData();
  }
  Delete(item){
    var database = firebase.database();
    database.ref('/kush/'+item.key).remove();
    this.items = [];
    this.GetDBData();
  }
  Update(item){
    var database = firebase.database();
    database.ref('/kush/'+item.key).set(this.name);
    this.GetDBData();
  }
  ActionConfirm(item) {
    const prompt = this.alertCtrl.create({
      title: 'Update',
      message: "Provide product name :",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            var database = firebase.database();
            database.ref('/kush/'+item.key).set(data.title);
            this.GetDBData();
          }
        }
      ]
    });
    prompt.present();
  }
}
