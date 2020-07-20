import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @ViewChild('closeModal') closeModal:ElementRef;
  @ViewChild('signInModal') signInModal:ElementRef;
  user: any = []
  flag1:Boolean = false
  plannerFlag:Boolean = false
  constructor(private authService: SocialAuthService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    var that = this
    that.user = JSON.parse(localStorage.getItem('token'))
    if(that.user == null){
      that.flag1=false
      that.user = []
    }
    else{
      that.flag1 = true
    }
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.user.push(
          {
            name: response.name,
            url : response.photoUrl
          }
          
        )
        this.flag1 = true
        localStorage.setItem("token" , JSON.stringify(this.user));
        this.closeModal.nativeElement.click();
        if(this.plannerFlag == true){
          this.router.navigate(['planner']);
        }
      }
    )
  }
 
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.user.push(
          {
            name: response.name,
            url : response.photoUrl
          } 
        )
        this.flag1 = true
        localStorage.setItem("token" , JSON.stringify(this.user));
        this.closeModal.nativeElement.click();
        if(this.plannerFlag == true){
          this.router.navigate(['planner']);
        }
      }
    )
  }
  signout(){
    this.flag1=false
    this.user=[]
    localStorage.removeItem('token')
  }

  planner(){
    if(this.flag1 ==true){
      this.router.navigate(['planner']);
    }
    else{
      this.plannerFlag = true
      this.signInModal.nativeElement.click();
    }
  }

}
