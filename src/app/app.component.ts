import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare const webkitSpeechRecognition: any;
declare const speechSynthesis: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  recognizedTexts: string[] = [];
  lastRecognizedSpeech = '';

  @ViewChild('taskbar', { static: false })
  taskbar!: ElementRef<HTMLDivElement>;

  ngOnInit() {}

  startRecognition() {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const speechResult = event.results[event.results.length - 1][0].transcript;
        if (speechResult !== this.lastRecognizedSpeech) {
          this.lastRecognizedSpeech = speechResult;
          this.recognizedTexts = []; // Clear previous recognition
          this.recognizedTexts.push(speechResult);
          this.processSpeech(speechResult);
          this.scrollToBottom();
        }
      };

      recognition.start();
    }
  }

  processSpeech(speechResult: string) {
    let response = '';

    if (speechResult.includes('How are you')) {
      response = 'I am fine';
    } else if (
      speechResult.includes("What's your name") ||
      speechResult.includes('What is your name')
    ) {
      response = 'My name is Andrew';
    } else if (speechResult.includes('Open YouTube')) {
      response = 'Opening YouTube...';
      window.open('https://www.youtube.com');
    }

    if (response !== '') {
      this.recognizedTexts.push(response);
    }
  }

  playbackSpeech() {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = this.recognizedTexts.join(' ');
    speechSynthesis.speak(utterance);
  }

  scrollToBottom() {
    setTimeout(() => {
      this.taskbar.nativeElement.scrollTop = this.taskbar.nativeElement.scrollHeight;
    });
  }
}
