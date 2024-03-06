<script setup lang="ts">
import router from '@/router'
import { onMounted, reactive, ref } from 'vue'
import { showToast, closeToast, showLoadingToast,showFailToast } from 'vant'
import HTTPClient from '../utils/HTTPClient'
import {usePositionStore} from "@/stores/position";

type AttendanceType = {
  id: string
  teacherId: string
  startDate: string
  endDate: string
  classId: string
  description: string
  createDate: string
  updateDate: string | null
}

type ClassInfoVOType = {
  classId: string
  className: string
  classNo: string
  classDescription: string
  majorId: string
  majorName: string
  departmentId: string
  departmentName: string
  universityId: string
  universityName: string
  universityImg: string
  createDate: string
  updateDate: string
}

type AttendanceVO = {
  attendance: AttendanceType
  classInfoVO: ClassInfoVOType
  attendanceStatus: string
}

const positionStore = usePositionStore();

const attendanceId = ref('')
const attendance = ref<AttendanceVO>()

const form = reactive({
  studentNo: '',
  studentName: '',
  timestamp: '',
  attendanceId: '',
  attendanceAddress: ''
})


const submit = async () => {
  if (!form.studentName) {
    showFailToast('姓名不能为空');
    return;
  }
  if (!form.studentNo) {
    showFailToast('学号不能为空');
    return;
  }
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  })
  form.timestamp = new Date().getTime() + ''
  form.attendanceId = attendanceId.value
  form.attendanceAddress = positionStore.address;
  await HTTPClient.post(
    `/mobile/studentAttendance/attendance`,
    JSON.stringify(form)
  )
  closeToast()
  showToast('签到成功！')
}

const fetchAttendanceInfo = async () => {
  attendance.value = await HTTPClient.post(
    `/mobile/studentAttendance/getAttendanceDetailById?attendanceId=${attendanceId.value}`
  );
  console.log(attendance.value);
  if (!attendance.value) {
    showFailToast('考勤id错误');
  }
}

onMounted(async () => {
  attendanceId.value = router.currentRoute.value.query.attendanceId as string
  await fetchAttendanceInfo()
})
</script>

<template>
  <div class="container">
    <div class="head">
      <div class="headContent">
        <img src="../assets/考勤.png" style="width: 100px" />
        <div style="width: 60%">
          <template v-if="!attendance">
            <van-skeleton title :row="3" />
          </template>
          <template v-else>
            <p style="font-weight: 800">
              {{ attendance?.classInfoVO.universityName }}-
              {{ attendance?.classInfoVO.departmentName }}- {{ attendance?.classInfoVO.majorName }}-
              {{ attendance?.classInfoVO.className }}
            </p>
            <p style="font-size: 14px; font-weight: 500">考勤签到</p>
          </template>
        </div>
      </div>
    </div>
    <van-divider style="margin: 0" />
    <div class="formContainer">
      <van-cell-group inset>
        <van-field v-model="form.studentNo" label="学号" placeholder="请输入学号" />
        <van-field v-model="form.studentName" label="姓名" placeholder="请输入用姓名" />
      </van-cell-group>
      <div style="padding-left: 15px; padding-right: 15px; margin-top: 15px">
        <van-button block type="success" @click="submit">签到</van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.head {
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
}
.headContent {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.formContainer {
  margin-top: 10px;
}
</style>
