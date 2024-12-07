import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User } from '../model/user';
import { TokenStorageService } from '../services/token-storage.service';
import { AuthService } from '../services/auth.service';



declare var particlesJS: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule,CommonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [User]
})


export class LoginComponent implements OnInit{
  loginForm:any =FormGroup;
  isLoggedIn = false;
  errorMessage: string | null = null;
   constructor(private formBuilder:FormBuilder,private user:User, private token:TokenStorageService, private authService:AuthService) { }
  
   ValidatorLogin()
   {
     this.loginForm = this.formBuilder.group({
       username:[null,],
       password:[null]
      })
 
   }


   login(): void {

    
    if (this.loginForm.invalid) {
      return;
    }

    const username = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;

    this.authService.login(username, password);
     
  }

  ngOnInit(): void {
   this.ValidatorLogin();
   this.authService.errorMessage$.subscribe(message => {
    this.errorMessage = message;
  });
    const body: HTMLElement | null = document.querySelector("body");
    const modal: HTMLElement | null = document.querySelector(".modal");
    const modalButton: HTMLElement | null = document.querySelector(".modal-button");
    const closeButton: HTMLElement | null = document.querySelector(".close-button");
    const scrollDown: HTMLElement | null = document.querySelector(".scroll-down");
    let isOpened = false;
    
    const openModal = (): void => {
      if (modal && body) {
        modal.classList.add("is-open");
        body.style.overflow = "hidden";
      }
    };
    
    const closeModal = (): void => {
      if (modal && body) {
        modal.classList.remove("is-open");
        body.style.overflow = "initial";
      }
    };
    
    window.addEventListener("scroll", (): void => {
      if (window.scrollY > window.innerHeight / 3 && !isOpened) {
        isOpened = true;
        if (scrollDown) {
          scrollDown.style.display = "none";
        }
        openModal();
      }
    });
    
    if (modalButton) {
      modalButton.addEventListener("click", openModal);
    }
    
    if (closeButton) {
      closeButton.addEventListener("click", closeModal);
    }
    
    document.onkeydown = (evt: KeyboardEvent): void => {
      evt = evt || window.event as KeyboardEvent;
      if (evt.key === "Escape") {
        closeModal();
      }
    };
  
 }}