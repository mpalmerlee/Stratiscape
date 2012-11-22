REM --formatting PRETTY_PRINT
java -jar ..\..\closure_compiler\compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS ^
--js_output_file Stratiscape-min.js ^
--js "./src/js-inherit.js" ^
--js "./src/Stratiscape.js" 2> output-debug.txt
