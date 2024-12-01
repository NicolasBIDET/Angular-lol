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
  editIndex: number | null = null; // Gère le mode édition
  currentUserEmail: string | null = null; // Stocke l'e-mail de l'utilisateur connecté


  constructor(
    private route: ActivatedRoute,
    private championService: ChampionService,
    private commentService: CommentService,
    public  auth: AngularFireAuth
  ) {}

  ngOnInit() {
    const championId = this.route.snapshot.paramMap.get('id');
    if (championId) {
      // Charger les détails du champion
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

  // Charger les commentaires
  loadComments() {
    if (this.champion) {
      this.commentService.getComments(this.champion.id).subscribe((comments) => {
        this.comments = comments;
      });
    }
  }

  // Ajouter un commentaire
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

  // Modifier un commentaire
  async updateComment(id: string, newComment: string) {
    try {
      await this.commentService.updateComment(id, newComment);
      this.editIndex = null; // Sortie du mode édition
    } catch (error) {
      console.error(error);
    }
  }

  async deleteComment(id: string) {
    try {
      await this.commentService.deleteComment(id);
      this.comments = this.comments.filter((comment) => comment.id !== id); // Mise à jour locale
    } catch (error) {
      console.error(error);
    }
  }

  toggleEditMode(index: number) {
    this.editIndex = this.editIndex === index ? null : index; // Active ou désactive le mode édition
  }

  cancelEdit() {
    this.editIndex = null; // Annule le mode édition
  }
}
