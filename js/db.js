/* ================================================================
   AutoLine — db.js
   Baza de date simulata cu localStorage
   Admin implicit: cazacu / cazacu123
================================================================ */

const DB = {

  // ---- INIT ----
  init() {
    if (!localStorage.getItem('al_initialized')) {
      this.setUsers([
        {
          id: 1,
          username: 'cazacu',
          password: 'cazacu123',
          role: 'admin',
          name: 'Cazacu Catalin',
          email: 'cazacucatalin010@gmail.com',
          createdAt: new Date().toISOString()
        }
      ]);
      this.setBookings([
        {
          id: this.genId(),
          name: 'Ion Popescu',
          phone: '+373 69 123 456',
          car: 'BMW 320d 2019',
          service: 'Schimb Ulei',
          date: '2026-04-24',
          time: '10:00',
          notes: 'Necesita filtru ulei Mann',
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: this.genId(),
          name: 'Maria Ionescu',
          phone: '+373 79 234 567',
          car: 'VW Golf 7 2017',
          service: 'Diagnosticare Auto',
          date: '2026-04-25',
          time: '11:30',
          notes: '',
          status: 'confirmed',
          createdAt: new Date().toISOString()
        },
        {
          id: this.genId(),
          name: 'Andrei Vasile',
          phone: '+373 68 345 678',
          car: 'Toyota Corolla 2021',
          service: 'Anvelope & Jante',
          date: '2026-04-22',
          time: '09:00',
          notes: '',
          status: 'completed',
          createdAt: new Date().toISOString()
        }
      ]);
      localStorage.setItem('al_initialized', '1');
    }
  },

  genId() {
    return 'al_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  },

  // ---- USERS ----
  getUsers()    { return JSON.parse(localStorage.getItem('al_users') || '[]'); },
  setUsers(arr) { localStorage.setItem('al_users', JSON.stringify(arr)); },

  getUserByCredentials(username, password) {
    return this.getUsers().find(u => u.username === username && u.password === password) || null;
  },

  addUser(user) {
    const users = this.getUsers();
    user.id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    user.createdAt = new Date().toISOString();
    users.push(user);
    this.setUsers(users);
    return user;
  },

  // Inregistrare cont nou — rol implicit 'user'
  registerUser({ username, password, name, email }) {
    const users = this.getUsers();
    if (users.find(u => u.username === username))
      return { error: 'Utilizatorul există deja.' };
    if (users.find(u => u.email && u.email === email))
      return { error: 'Email-ul este deja înregistrat.' };
    const user = this.addUser({ username, password, name, email, role: 'user' });
    return { user };
  },

  // Schimba rolul unui user (doar admin)
  setUserRole(userId, role) {
    const users = this.getUsers().map(u => u.id === userId ? { ...u, role } : u);
    this.setUsers(users);
    const s = this.getSession();
    if (s && s.id === userId) this.setSession({ ...s, role });
  },

  deleteUser(userId) {
    if (userId === 1) return false; // contul cazacu e protejat
    this.setUsers(this.getUsers().filter(u => u.id !== userId));
    return true;
  },

  // ---- SESSION ----
  getSession()     { return JSON.parse(sessionStorage.getItem('al_session') || 'null'); },
  setSession(user) { sessionStorage.setItem('al_session', JSON.stringify(user)); },
  clearSession()   { sessionStorage.removeItem('al_session'); },
  isLoggedIn()     { return !!this.getSession(); },
  isAdmin()        { const s = this.getSession(); return s && s.role === 'admin'; },

  // ---- BOOKINGS ----
  getBookings()    { return JSON.parse(localStorage.getItem('al_bookings') || '[]'); },
  setBookings(arr) { localStorage.setItem('al_bookings', JSON.stringify(arr)); },

  addBooking(b) {
    const bookings = this.getBookings();
    b.id = this.genId();
    b.status = 'pending';
    b.createdAt = new Date().toISOString();
    bookings.push(b);
    this.setBookings(bookings);
    return b;
  },

  updateBooking(id, changes) {
    const bookings = this.getBookings().map(b => b.id === id ? { ...b, ...changes } : b);
    this.setBookings(bookings);
  },

  deleteBooking(id) {
    this.setBookings(this.getBookings().filter(b => b.id !== id));
  },

  getBookingStats() {
    const all = this.getBookings();
    return {
      total:     all.length,
      pending:   all.filter(b => b.status === 'pending').length,
      confirmed: all.filter(b => b.status === 'confirmed').length,
      completed: all.filter(b => b.status === 'completed').length,
      cancelled: all.filter(b => b.status === 'cancelled').length,
    };
  }
};

DB.init();
