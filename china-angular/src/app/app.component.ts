import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const GET_BOOKS = gql`
  query getAllBooks {
    books {
      title
      author
    }
  }
`;

interface IBook {
  title: string;
  author: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'china-angular';
  listBooks: IBook[] = [];
  loading = true;

  constructor(apollo: Apollo) {
    apollo
      .watchQuery<{ books: IBook[] }>({
        query: GET_BOOKS,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.listBooks = data.books;
        this.loading = loading;
      });
  }
}
