<template>
    <div class="create_container">
        <div class="create_card">
            <div class="card-header">
                <h4>Add Students</h4>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="name">Name</label>
                    <input type="text" v-model="model.student.name" @keydown.enter="focusNextField('course')"
                        @input="validateName" class="form-control" id="name" />
                    <span v-if="errors.name" class="text-danger">{{ errors.name }}</span>
                </div>
                <div class="mb-3">
                    <label for="course">Course</label>
                    <input type="text" v-model="model.student.course" @input="validateCourse" class="form-control"
                        id="course" />
                    <span v-if="errors.course" class="text-danger">{{ errors.course }}</span>
                </div>
                <div class="mb-3">
                    <label for="email">Email</label>
                    <input type="text" v-model="model.student.email" @input="validateEmail" class="form-control"
                        id="email" />
                    <span v-if="errors.email" class="text-danger">{{ errors.email }}</span>
                </div>
                <div class="mb-3">
                    <label for="phone">Phone</label>
                    <input type="text" v-model="model.student.phone" @input="validatePhone" class="form-control"
                        id="phone" />
                    <span v-if="errors.phone" class="text-danger">{{ errors.phone }}</span>
                </div>
                <div class="mb-3">
                    <button type="button" @click="saveStudent" 
                        class="btn_btn-primary" role="button">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            model: {
                student: {
                    id: '',
                    name: '',
                    course: '',
                    email: '',
                    phone: '',
                }
            },
            errors: {},
            students: [] // Store the retrieved students here
        }
    },
    computed: {
        isFormValid() {
            return Object.keys(this.errors).length === 0 &&
                this.model.student.name &&
                this.model.student.course &&
                this.model.student.email &&
                this.model.student.phone;
        }
    },
    methods: {
        validateRequired(field, label) {
            if (!this.model.student[field]) {
                this.errors[field] = `${label} is required`;
            } else {
                delete this.errors[field];
            }
        },
        validateName() {
            this.validateRequired('name', 'Name');
            const nameRegex = /^[a-zA-Z\s]*$/;
            if (!nameRegex.test(this.model.student.name)) {
                this.errors.name = 'Name should contain only text';
            } else {
                delete this.errors.name;
            }
        },
        validateEmail() {
            this.validateRequired('email', 'Email');
            const emailRegex = /^[^\s@]+@gmail\.com$/;
            if (!emailRegex.test(this.model.student.email)) {
                this.errors.email = 'Enter a valid Gmail address';
            } else {
                delete this.errors.email;
            }
        },
        validatePhone() {
            this.validateRequired('phone', 'Phone');
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(this.model.student.phone)) {
                if (this.model.student.phone.length > 10) {
                    this.errors.phone = 'Invalid phone number: More than 10 digits';
                } else {
                    this.errors.phone = 'Phone number should contain 10 digits';
                }
            } else {
                delete this.errors.phone;
            }
        },
        validateCourse() {
            this.validateRequired('course', 'Course');
        },
        focusNextField(field) {
            this.$refs[field].focus();
        },
        saveStudent() {
            if (this.isFormValid) {
                const newStudent = { ...this.model.student }; // Create a copy of the student object

                // Retrieve the existing students from the database
                axios.get('http://localhost:3000/student')
                    .then(response => {
                        this.students = response.data; // Store the retrieved students

                        // Check if the student already exists in the database
                        const existingStudent = this.students.find(student => student.name === newStudent.name && student.email === newStudent.email);
                        if (!existingStudent) {
                            // Find the maximum ID
                            let maxId = 0;
                            if (this.students.length > 0) {
                                maxId = Math.max(...this.students.map(student => student.id));
                            }

                            // Increment the maximum ID by one to get the new student ID
                            const newId = maxId + 1;

                            // Assign new ID to the student
                            newStudent.id = newId.toString(); // Convert ID to string

                            axios.post('http://localhost:3000/student', newStudent)
                                .then(response => {
                                    console.log(response.data);
                                    alert('Student saved successfully!');
                                    this.model.student = {
                                        id: '', // Reset ID
                                        name: '',
                                        course: '',
                                        email: '',
                                        phone: '',
                                    };
                                    this.$router.push('/students');
                                })
                                .catch(error => {
                                    console.error(error);
                                    alert('Error saving student!');
                                });
                        } else {
                            alert('Student with the same name and email already exists!');
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        alert('Error retrieving existing students!');
                    });
            }
        },
        focusNextField(field) {
            this.$refs[field].focus();
        },

        deleteStudent(id) {
            axios.delete(`http://localhost:3000/student/${id}`)
                .then(response => {
                    console.log(response.data);
                    alert('Student deleted successfully!');

                    // Update the IDs of subsequent students
                    this.students = this.students.filter(student => student.id !== id);
                    for (let i = 0; i < this.students.length; i++) {
                        if (this.students[i].id > id) {
                            this.students[i].id = i + 1;
                        }
                    }

                    // Update the students array in the database
                    axios.put('http://localhost:3000/student', this.students)
                        .then(response => {
                            console.log(response.data);
                        })
                        .catch(error => {
                            console.error(error);
                            alert('Error updating students!');
                        });
                })
                .catch(error => {
                    console.error(error);
                    alert('Error deleting student!');
                });
        }
    }
}
</script>