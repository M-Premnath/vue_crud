<template>
    <div class="edit_container">
        <div class="edit_card">
            <div class="card-header">
                <h4>Edit Student</h4>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="name">Name</label>
                    <input type="text" v-model="editedStudent.name" @input="validateName" class="form-control"
                        id="name" />
                    <span v-if="errors.name" class="text-danger">{{ errors.name }}</span>
                </div>
                <div class="mb-3">
                    <label for="course">Course</label>
                    <input type="text" v-model="editedStudent.course" @input="validateCourse" class="form-control"
                        id="course" />
                    <span v-if="errors.course" class="text-danger">{{ errors.course }}</span>
                </div>
                <div class="mb-3">
                    <label for="email">Email</label>
                    <input type="text" v-model="editedStudent.email" @input="validateEmail" class="form-control"
                        id="email" />
                    <span v-if="errors.email" class="text-danger">{{ errors.email }}</span>
                </div>
                <div class="mb-3">
                    <label for="phone">Phone</label>
                    <input type="text" v-model="editedStudent.phone" @input="validatePhone" class="form-control"
                        id="phone" />
                    <span v-if="errors.phone" class="text-danger">{{ errors.phone }}</span>
                </div>
                <div class="mb-3">
                    <button type="button" @click="updateStudent" class="btn_btn-primary">Update</button>
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
            editedStudent: {}, // Initialize an empty object to hold the edited student data
            errors: {} // Initialize errors object
        }
    },
    mounted() {
        // Retrieve student data from route parameters
        const studentId = this.$route.params.id;
        this.fetchStudentData(studentId); // Call the fetchStudentData method
    },
    computed: {
        isFormValid() {
            return Object.keys(this.errors).length === 0 &&
                this.editedStudent.name &&
                this.editedStudent.course &&
                this.editedStudent.email &&
                this.editedStudent.phone;
        }
    },
    methods: {
        fetchStudentData(studentId) {
            axios.get(`http://localhost:3000/student/${studentId}`)
                .then(response => {
                    console.log('Response from server:', response.data);
                    // Assuming response.data contains the student data
                    this.editedStudent = response.data;
                })
                .catch(error => {
                    console.error('Error fetching student data:', error);
                    alert('Error fetching student data. Please try again later.');
                });
        },
        validateRequired(field, label) {
            if (!this.editedStudent[field]) {
                this.errors[field] = `${label} is required`;
            } else {
                delete this.errors[field];
            }
        },
        validateName() {
            this.validateRequired('name', 'Name');
            const nameRegex = /^[a-zA-Z\s]*$/;
            if (!nameRegex.test(this.editedStudent.name)) {
                this.errors.name = 'Name should contain only text';
            } else {
                delete this.errors.name;
            }
        },
        validateEmail() {
            this.validateRequired('email', 'Email');
            const emailRegex = /^[^\s@]+@gmail\.com$/;
            if (!emailRegex.test(this.editedStudent.email)) {
                this.errors.email = 'Enter a valid Gmail address';
            } else {
                delete this.errors.email;
            }
        },
        validatePhone() {
            this.validateRequired('phone', 'Phone');
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(this.editedStudent.phone)) {
                if (this.editedStudent.phone.length > 10) {
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
        highlightUpdatedField(newValue, oldValue) {
            // Highlight the updated field by comparing old and new values
            return `<span style="background-color: yellow">${newValue}</span> (was ${oldValue})`;
        },

        updateStudent() {
    // Assuming you have some code to update the student data here
    axios.put(`http://localhost:3000/student/${this.editedStudent.id}`, this.editedStudent)
        .then(response => {
            console.log('Response from server:', response.data);
            alert('Student data updated successfully!');
            this.$router.push('/students');
        })
        .catch(error => {
            console.error('Error updating student data:', error);
            alert('Error updating student data. Please try again later.');
        });
}

    

    }
}
</script>
