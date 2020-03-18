<template>
  <el-container>
    <el-aside width="350px">
      <el-card class="box-card" shadow="always" style="margin: 1em;">
        <el-form ref="form" :model="form" label-width="70px" size="small" :disabled="loading">
          <el-form-item label="邮箱服务">
            <el-select v-model="form.service" placeholder="请选择" style="width: 100%">
              <el-option v-for="(item, index) in services" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱账号">
            <el-input v-model="form.user" placeholder="请输入账号" type="email"></el-input>
          </el-form-item>
          <el-form-item label="邮箱密码">
            <el-input v-model="form.pass" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱主题">
            <el-input v-model="form.subject" placeholder="请输入主题"></el-input>
          </el-form-item>
          <el-form-item label="邮箱内容">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 10}"
              placeholder="请输入内容"
              v-model="form.content"
            ></el-input>
          </el-form-item>
          <el-button
            type="info"
            plain
            icon="el-icon-message"
            style="width: 100%;"
            size="small"
            @click="submit"
          ></el-button>
        </el-form>
      </el-card>
    </el-aside>
    <el-main>
      <el-alert
        title="提示:"
        type="warning"
        :closable="false"
        description="请确保第一列为合法的邮箱地址，否则该行对应的邮件将无法发送。"
        style="margin-bottom: 1em;"
        show-icon
      ></el-alert>
      <div id="hot-preview">
        <HotTable ref="hot" :settings="tableSettings"></HotTable>
      </div>
      <el-progress
        class="progress"
        v-if="loading"
        type="circle"
        :percentage="percentage"
        color="#3f51b5"
      ></el-progress>
    </el-main>
  </el-container>
</template>

<script>
import HotTable from "@handsontable/vue";
import nodemailer from "nodemailer";
import async from "async";

export default {
  name: "landing-page",
  components: { HotTable },
  data() {
    return {
      editable: true,
      percentage: 0,
      loading: false,
      tableSettings: {
        width: "100%",
        height: "483",
        colHeaders: [
          "选中该表格，请将数据复制到这里",
          "第一列",
          "第二列",
          "第三列"
        ],
        data: [["", "", "", ""]],
        fixedColumnsLeft: 1,
        manualColumnResize: true,
        manualRowResize: true,
        beforePaste(data) {
          if (data.length > 0) {
            this.updateSettings({
              colHeaders: data.shift(),
              data
            });
          }
        }
      },
      services: [
        "126",
        "163",
        "Gmail",
        "Hotmail",
        "iCloud",
        "QQ",
        "QQex",
        "Yahoo"
      ],
      form: {
        service: "",
        user: "",
        pass: "",
        subject: "",
        content: ""
      },
      bundle: []
    };
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    submit() {
      this.loading = true;
      const head = this.$refs.hot.table.getColHeader();
      const data = this.$refs.hot.table.getData();
      this.bundle = data.reduce((memo, row) => {
        const to = row.shift();
        const table = {
          head: head.slice(1),
          rows: [row]
        };
        if (!to) return memo;
        return memo.concat({ to, table });
      }, []);

      const transporter = nodemailer.createTransport({
        service: this.form.service,
        auth: {
          user: this.form.user,
          pass: this.form.pass
        }
      });

      async.eachOfSeries(
        this.bundle,
        (email, index, callback) => {
          const mailOptions = {
            from: this.form.user,
            to: email.to,
            subject: this.form.subject,
            html: this.generateHTML(
              this.form.content,
              email.table.head,
              email.table.rows
            )
          };

          transporter.sendMail(mailOptions, error => {
            if (error)
              return callback(new Error(`发送给“${mailOptions.to}”失败`));
            this.percentage = (index * 100) / this.bundle.length;
            return callback();
          });
        },
        error => {
          if (error) {
            this.$message.error(error.message);
          } else {
            this.$message({
              message: "发送成功",
              type: "success"
            });
          }
          this.loading = false;
          this.percentage = 0;
        }
      );
    },
    generateHTML(content, header, rows) {
      const text = `<p>${content.replace(/\n/g, "<br>")}</p>`;
      const thead = header
        .map(
          cell =>
            `<th bgcolor="#335b8a" nowrap="nowrap" valign="top" width="120"><font color="#ffffff">${cell}</font></th>`
        )
        .join("");
      const trows = rows
        .map(row => {
          const rowHTML = row.map(cell => `<td valign="top">${cell}</td>`);
          return `<tr>${rowHTML.join("")}</tr>`;
        })
        .join("");
      const table = `<table style="border-collapse: collapse;" border="1" cellpadding="2" cellspacing="2" width="100%">
          <tbody>
          <tr>${thead}</tr>
          ${trows}
        </tbody>
        </table>`;

      return text + table;
    }
  }
};
</script>

<style scoped>
.el-aside {
  color: #333;
}
.el-main {
  color: #333;
  padding-left: 0;
}
.toggle-btn {
  position: fixed;
  bottom: 2em;
  right: 2em;
}
.progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-60%, -50%);
}
</style>
