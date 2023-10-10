// enum Eidition {
//     Education,
//     Enterprise,
// }

// type EducationLoginRole = "Teacher" | "Student"
// type EnterpriseLoginRole = "Admin" | "Develop"

// class RoleManager {
//     // 当前使用版本
//     private edition: Eidition
//     private role: EducationLoginRole | EnterpriseLoginRole
//     constructor(edition: Eidition) {
//         this.edition = edition
//         this.getRole()
//     }

//     // 获取角色
//     getRole(role?: EducationLoginRole | EnterpriseLoginRole) {

//         if (this.edition == Eidition.Education && !role) {
//             this.role = "Teacher"
//         }
//         if (this.edition == Eidition.Enterprise && !role) {
//             this.role = "Admin"
//         }
//     }
// }
