package com.vys.staff_evaluation_system.dto;

public class UpdateMemberRequest {
    private String dep_name;
    private String memberName;
    private int newAchievementMarks;
    private String newRemarks;

    // Getters and Setters
    public String getDep_name() {
        return dep_name;
    }

    public void setDep_name(String dep_name) {
        this.dep_name = dep_name;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public int getNewAchievementMarks() {
        return newAchievementMarks;
    }

    public void setNewAchievementMarks(int newAchievementMarks) {
        this.newAchievementMarks = newAchievementMarks;
    }

    public String getNewRemarks() {
        return newRemarks;
    }

    public void setNewRemarks(String newRemarks) {
        this.newRemarks = newRemarks;
    }
}