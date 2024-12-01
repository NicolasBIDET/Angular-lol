import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChampionService } from '../service/champion.service';
import { CommentService } from '../service/comment.service';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
})
export class ForumComponent implements OnInit {
  champion: any;
  comments: any[] = [];
  newComment = '';
  editIndex: number | null = null;
  currentUserEmail: string | null = null;
  showDeleteModal: boolean = false;
  commentToDelete: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private championService: ChampionService,
    private commentService: CommentService,
    public  auth: AngularFireAuth
  ) {}

  ngOnInit() {
    const championId = this.route.snapshot.paramMap.get('id');
    if (championId) {
      this.championService.getChampionDetails(championId).subscribe((data) => {
        this.champion = data.data[championId];
        this.loadComments();
      });
    } else {
      console.error('Champion ID is null');
    }
    this.auth.authState.subscribe((user) => {
      this.currentUserEmail = user?.email || null;
    });
  }

  loadComments() {
    if (this.champion) {
      this.commentService.getComments(this.champion.id).subscribe((comments) => {
        this.comments = comments;
      });
    }
  }

  async addComment() {
    if (this.newComment.trim()) {
      try {
        await this.commentService.addComment(this.champion.id, this.newComment);
        this.newComment = '';
      } catch (error) {
        console.error(error);
      }
    }
  }

  async updateComment(id: string, newComment: string) {
    try {
      await this.commentService.updateComment(id, newComment);
      this.editIndex = null;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteComment(id: string) {
    try {
      await this.commentService.deleteComment(id);
      this.comments = this.comments.filter((comment) => comment.id !== id);
    } catch (error) {
      console.error(error);
    }
  }

  toggleEditMode(index: number) {
    this.editIndex = this.editIndex === index ? null : index;
  }

  cancelEdit() {
    this.editIndex = null;
  }

  openDeleteModal(commentId: string) {
    this.commentToDelete = commentId;
    this.showDeleteModal = true;
  }

  onDeleteConfirmed(confirm: boolean) {
    this.showDeleteModal = false;
    if (confirm && this.commentToDelete) {
      this.deleteComment(this.commentToDelete);
      this.commentToDelete = null;
    }
  }
}
