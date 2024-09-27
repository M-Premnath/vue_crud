<template>
    <div class="Table-container">
      <div class="table_card">
        <div class="card-header">
          <h4>Students Table
            <RouterLink class="btn btn-primary float-end" to="/students/create">
              Add student
            </RouterLink>
          </h4>
        </div>
        <div class="card-body">
          <table class="table table-bordered">
            <thead id="head">
              <tr>
                <!-- <th>ID</th> -->
                <th>Name</th>
                <th>Course</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in paginatedStudents" :key="student.id">
                <!-- <td>{{ student.id }}</td> -->
                <td>{{ student.name }}</td>
                <td>{{ student.course }}</td>
                <td>{{ student.email }}</td>
                <td>{{ student.phone }}</td>
                <td>
                  <RouterLink class="btn btn-success " :to="{path:'/students/'+student.id}"
                    @click="editStudent(student)">
                    Edit
                  </RouterLink>
                  <button type="button" @click="confirmDelete(student)"
                    class="btn btn-danger float-end">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="pagination">
        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" @input="updatePage"></b-pagination>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Students',
    data() {
      return {
        students: [],
        rows: 0,
        currentPage: 1,
        perPage: 10,
      }
    },
    mounted() {
      this.fetchStudents();
    },
    computed: {
      paginatedStudents() {
        return this.students.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
      }
    },
    methods: {
      fetchStudents() {
        fetch('http://localhost:3001/student')
         .then(res => res.json())
         .then(data => {
            this.students = data;
            this.rows = data.length;
          })
         .catch(err => console.error(err));
      },
      async deleteStudent(id) {
        try {
          const response = await fetch(`http://localhost:3001/student/${id}`, {
            method: 'DELETE'
          });
          if (response.ok) {
            console.log(`Student with ID ${id} deleted successfully`);
            // Update the students list after deletion
            this.students = this.students.filter(student => student.id!== id);
            this.rows = this.students.length;
          } else {
            // Log the status code and error message
            console.error(`Failed to delete student with ID ${id}. Status: ${response.status}, ${response.statusText}`);
          }
        } catch (error) {
          // Log any network errors
          console.error('Network error:', error);
        }
      },
      confirmDelete(student) {
        const confirmMessage = `Are you sure you want to delete student:
          Name: ${student.name}
          Course: ${student.course}
          Email: ${student.email}
          Phone: ${student.phone}`;
        if (confirm(confirmMessage)) {
          this.deleteStudent(student.id);
        }
      },
      updatePage() {
        // Update the paginated students list when the page changes
        this.paginatedStudents = this.students.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
      }
    }
  }
  </script>
  
  <style>
  @import '/src/assets/table.css';
  </style>