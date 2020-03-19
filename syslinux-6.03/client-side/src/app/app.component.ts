import { Component, Inject } from '@angular/core';
import { NewsService } from './news.service';
import { DataSource } from '@angular/cdk/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ModalComponent } from './modal.component';

export interface News {
  _id: String;
  title: String;
  author: String;
  date: String;
  story: String;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NewsService]
})
export class AppComponent {
  dataSource: any;

  constructor(
    private newsService: NewsService,
    public dialog: MatDialog
  ){}
  

  ngOnInit() {
    this.newsService.getNews().subscribe((data)=>{
      this.dataSource = data;
      console.log(this.dataSource);
    });
  } 

  getStory(story, title): void{
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '768px',
      data: {story: story, title: title}
    });

    dialogRef.afterClosed().subscribe(result => {
      story = result;
    });

    
  }
  

  displayedColumns: string[] = ['title', 'author', 'date'];


} 

export class DialogBodyComponent {
  constructor( public dialogRef: MatDialogRef<DialogBodyComponent>){}
}
