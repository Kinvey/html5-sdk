(function(root, Kinvey) {
  function addBooks(books) {
    var tbody = document.getElementsByTagName('tbody')[0];

    for(var i = 0; i < books.length; i++) {
      var book = books[i];
      var tr = document.createElement('tr');
      tr.className = 'book';
      tr.innerHTML = '<td>' + book._id + '</td>'
        + '<td>' + book.title + '</td>'
        + '<td>' + book.author + '</td>'
        + '<td>' + book.isbn + '</td>'
        + '<td><p>' + book.summary + '</p></td>';
      tbody.appendChild(tr);
    }
  }

  function clearBooks() {
    var tbody = document.getElementsByTagName('tbody')[0];
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  }

  root.BooksView = {
    refresh: function() {
      var collection = Kinvey.DataStore.collection('Books', Kinvey.DataStoreType.Sync);
      return collection.find().subscribe(function onNext(books) {
        clearBooks();
        addBooks(books);
      });
    },

    pull: function() {
      var collection = Kinvey.DataStore.collection('Books', Kinvey.DataStoreType.Sync);
      return collection.pull()
        .then(function(books) {
          clearBooks();
          addBooks(books);
        })
        .catch(function(error) {
          console.error(error);
        });
    },

    add: function() {
      var that = this;
      var collection = Kinvey.DataStore.collection('Books', Kinvey.DataStoreType.Sync);
      return collection.save({
        title: 'Kinvey',
        author: 'Kinvey'
      }).then(function() {
        that.refresh();
      });
    },

    push: function() {
      var collection = Kinvey.DataStore.collection('Books', Kinvey.DataStoreType.Sync);
      return collection.push().then(function() {
        alert('Push complete');
      });
    },

    clear: function() {
      var collection = Kinvey.DataStore.collection('Books', Kinvey.DataStoreType.Sync);
      return collection.clear().then(function() {
        clearBooks();
        addBooks(books);
      });
    }
  };
})(window, window.Kinvey);
