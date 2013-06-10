function calculate(){
    var input= $('#text1:first');
    var values=input.val();
    var out= $('#text1_out:first');
    out.text(values);
    console.log(values);
}