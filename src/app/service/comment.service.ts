import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Timestamp } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  // Ajouter un commentaire
  async addComment(champion: string, commentaire: string) {
    const user = await this.auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');
    const newComment = {
      champion,
      commentaire,
      date_creation: Timestamp.now(),
      user: user.email,
    };
    return this.firestore.collection('Forum').add(newComment);
  }

  // Récupérer les commentaires liés à un champion
  getComments(champion: string) {
    return this.firestore
      .collection('Forum', (ref) => ref.where('champion', '==', champion).orderBy('date_creation', 'asc'))
      .valueChanges({ idField: 'id' });
  }

  // Modifier un commentaire
  async updateComment(id: string, newComment: string) {
    const user = await this.auth.currentUser;
    if (!user) throw new Error('Utilisateur non authentifié');

    // Vérifiez que l'utilisateur est l'auteur du commentaire avant de modifier
    const doc = await this.firestore.collection('Forum').doc<Comment>(id).get().toPromise();
    if (doc?.data()?.user !== user.email) throw new Error('Permission refusée');
    return this.firestore.collection('Forum').doc(id).update({ commentaire: newComment });
  }

  async deleteComment(id: string) {
    const user = await this.auth.currentUser;
    const doc = await this.firestore.collection('Forum').doc<Comment>(id).get().toPromise();

    if (doc?.data()?.user !== user?.email) {
      throw new Error('Permission denied');
    }

    return this.firestore.collection('Forum').doc(id).delete();
  }
}

export interface Comment {
    champion: string;
    commentaire: string;
    date_creation: any; // Peut être Timestamp ou Date
    user: string;
  }
  