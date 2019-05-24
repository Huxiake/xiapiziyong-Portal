// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function() {
      var title = this.htmlTitle
      html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: false
      }).then(function(canvas) {
        console.log(canvas)
        const contentWidth = canvas.width
        const contentHeight = canvas.height
        const pageHeight = contentWidth / 141.73 * 85.04
        // const pageHeight = contentWidth / 612 * 792
        // const pageHeight = contentHeight
        let leftHeight = contentHeight
        let position = 0
        const imgWidth = 141.73
        const imgHeight = 141.73 / contentWidth * contentHeight
        const pageData = canvas.toDataURL('image/jpeg', 1.0)
        const PDF = new JsPDF('', 'pt', 'tab53')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 85.04
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      }
      )
    }
  }
}
