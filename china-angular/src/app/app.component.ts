import { Component } from '@angular/core';
import { Observable } from '@apollo/client/utilities';
import { Apollo, gql, QueryRef } from 'apollo-angular';

const GET_BOOKS = gql`
  query getAllBooks {
    books {
      title
      author
    }
  }
`;

const SUBSCRIBE_CREATE_BOOK = gql`
  subscription subscribCreateBook($isEven: Boolean) {
    bookCreatedWithFilter(isEven: $isEven) {
      id
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
  books: Observable<any>;
  getBookQuery: QueryRef<any>;

  constructor(apollo: Apollo) {
    this.getBookQuery = apollo.watchQuery<{ books: IBook[] }>({
      query: GET_BOOKS,
    });

    this.books = this.getBookQuery.valueChanges as any;

    this.books.subscribe(({ data, loading }) => {
      this.listBooks = data.books;
      this.loading = loading;
    });

    this.getBookQuery.subscribeToMore({
      document: SUBSCRIBE_CREATE_BOOK,
      variables: {
        isEven: false,
      },
      updateQuery: (prev, { subscriptionData }) => {
        console.log('prev', prev);
        console.log('subscriptionData', subscriptionData.data);
        return {
          ...prev,
          books: [...prev.books, subscriptionData.data.bookCreatedWithFilter],
        };
      },
    });
  }
}
