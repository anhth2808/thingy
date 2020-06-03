'use strict';
var admin = {
  question: () => {   
    
    // AJAX Function

    const deleteQuestion = (btn) => {
      $('.delete-btn').click(e => {
        const btn = $(e.target)
        const questionId = btn.attr('data-id')
        const questiontElement = btn.closest('tr');

        fetch("/admin/api/question/" + questionId, {
          method: "DELETE",
        })
        .then(result => {
            return result;
        })
        .then(data => {
          questiontElement.remove()
        })
        .catch(err => {
            console.log(err);
        })
      })      
    }
    
    // AJAX running function
    deleteQuestion()
  },
  helpers: {
    
  }
};