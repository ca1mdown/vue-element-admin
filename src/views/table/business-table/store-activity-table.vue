<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.activityName"
        placeholder="活动名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.sort" style="width: 140px;margin-left: 10px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <!-- `f_order_pay_status` int(2) NOT NULL DEFAULT '0' COMMENT '支付状态，10未支付，20已支付，30已全部退款，31已部分退款', -->
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        Export
      </el-button> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" width="220px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.activityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动详情" width="250px" align="center">
        <template slot-scope="{ row }">
          <span>
            {{
              `活动商品
              ${formatPrice(JSON.parse(row.activityDetail).activityPrice)}
              元任选
              ${JSON.parse(row.activityDetail).selectNum}
              件体验
              ${JSON.parse(row.activityDetail).itemTimes}
              次`
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.activityFlag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.activityStartTime | parseTime("{y}-{m}-{d} {h}:{i}") }} 至</span>
          <span>{{ row.activityEndTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务员" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.partnerUserFlag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="110px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="店铺名称" prop="activityName">
          <el-select v-model="temp.storeFlag" class="filter-item" placeholder="请选择" disabled>
            <el-option v-for="item in activityNameOptions" :key="item.storeFlag" :label="item.activityName" :value="item.storeFlag" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="partnerRate">
          <el-input v-model="temp.partnerRate" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="说明" prop="activityDetail">
          <el-input v-model="temp.activityDetail" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="价格" prop="goodsPrice">
          <el-input v-model="temp.goodsPrice" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="库存" prop="goodsStock">
          <el-input v-show="!hiddenGoodsStock" v-model="temp.goodsStock" placeholder="请输入库存" />
          <el-checkbox v-model="hiddenGoodsStock">
            无限库存
          </el-checkbox>
        </el-form-item>
        <el-form-item label="主图（多图）" prop="goodsImgUrl">
          <imageUpload v-model="temp.goodsImgUrl" />
        </el-form-item>
        <el-form-item label="图文详情（多图）" prop="goodsDetail">
          <imageUpload v-model="temp.goodsDetail" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createStoreActivity, updateStoreActivity, deleteStoreActivity } from '@/api/store-activity'
import { fetchStoreList } from '@/api/store-info'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import imageUpload from '@/components/ImageUpload'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'StoreTable',
  components: { Pagination, imageUpload },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        storeFlag: this.$route.params.storeFlag
        // storeFlag: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      activityNameOptions: [],
      showReviewer: false,
      temp: {
        id: undefined,
        activityName: '',
        storeFlag: this.$route.params.storeFlag,
        partnerUserFlag: '',
        partnerRate: '',
        activityDetail: '',
        goodsPrice: '',
        goodsMarketPrice: '',
        goodsStock: '',
        goodsSubedStock: '',
        goodsAddedStock: '',
        goodsImgUrl: '',
        goodsDetail: '',
        activityType: '100'
      },
      hiddenGoodsStock: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        // activityName: [
        //   { required: true, message: 'activityName is required', trigger: 'blur' }
        // ],
        partnerRate: [
          { required: true, message: 'partnerRate is required', trigger: 'blur' }
        ],
        // goodsImgUrl: [
        //   { required: true, message: 'goodsImgUrl is required', trigger: 'blur' }
        // ],
        // activityDetail: [
        //   { required: true, message: 'activityDetail is required', trigger: 'blur' }
        // ],
        goodsPrice: [
          { required: true, message: 'goodsPrice is required', trigger: 'blur' },
          { pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确的产品价格:整数或者保留两位小数' }
        ]
        // goodsStock: [
        //   { required: true, message: 'goodsStock is required', trigger: 'blur' }
        // ],
        // goodsDetail: [
        //   { required: true, message: 'goodsDetail is required', trigger: 'blur' }
        // ]
      },
      downloadLoading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      value1: '',
      value2: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      if (!parseInt(this.listQuery.storeFlag)) return
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        this.listLoading = false
        fetchStoreList({
          // storeFlag: undefined
          storeFlag: this.$route.params.storeFlag
        }).then(response => {
          if (!response.data.list.length) {
            // this.$router.push('/table/store-table')
            this.$message({
              message: '该店铺不存在',
              type: 'info'
            })
          }
          this.activityNameOptions = response.data.list
        })
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        activityName: '',
        storeFlag: parseInt(this.$route.params.storeFlag),
        partnerUserFlag: '',
        partnerRate: '',
        activityDetail: '',
        goodsPrice: '',
        goodsMarketPrice: '',
        goodsStock: '',
        goodsSubedStock: '',
        goodsAddedStock: '',
        goodsImgUrl: '',
        goodsDetail: '',
        activityType: '200'
      }
      this.hiddenGoodsStock = false
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.storeFlag = this.$route.params.storeFlag || parseInt(Math.random() * 100) + 1024
          this.temp.partnerUserFlag = parseInt(Math.random() * 100) + 1024 // mock a storeFlag
          this.temp.goodsPrice = parseFloat(this.temp.goodsPrice) * 100
          if (this.hiddenGoodsStock === true) {
            this.temp.goodsStock = -1
          }
          createStoreActivity(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.goodsStock === -1) {
        this.temp.goodsStock = ''
        this.hiddenGoodsStock = true
      }
      this.temp.goodsPrice = this.formatPrice(this.temp.goodsPrice)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.goodsPrice = parseFloat(this.temp.goodsPrice) * 100
          if (this.hiddenGoodsStock === true) {
            this.temp.goodsStock = -1
          }
          const tempData = Object.assign({}, this.temp)
          tempData.createTime = undefined
          tempData.modifyTime = undefined
          tempData.createBy = undefined
          tempData.modifyBy = undefined
          updateStoreActivity(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('确认删除该条数据?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const tempData = Object.assign({}, row) // copy obj
          tempData.createTime = undefined
          tempData.modifyTime = undefined
          tempData.createBy = undefined
          tempData.modifyBy = undefined
          deleteStoreActivity(tempData).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          })
        })
        .catch(err => { console.error(err) })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = [
          'timestamp',
          'title',
          'type',
          'importance',
          'status'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    formatPrice(price) {
      if (!(price % 100)) {
        return (price + '').slice(0, -2)
      } else {
        if (price >= 100) {
          return (price + '').slice(0, -2) + '.' + (price + '').slice(-2)
        } else if (price >= 10 && price < 100) {
          return '0.' + price
        } else if (price < 100) {
          return '0.0' + price
        } else {
          return price
        }
      }
    }
  }
}
</script>
