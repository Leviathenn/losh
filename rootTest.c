/**
    

    THIS IS FOR THE GENERAL PURPOSE PACKAGE MANAGER LOSH, THIS IS A TEST FOR THE ROOT VERSION OF LOSH.
    THE FOLLOWING CODE IS BASIC BUT WILL REQUIRES ROOT TO RUN. THIS IS THE FIRST OFFICAL PACKAGE AND TEST OF LOSH.

    THE FOLLOWING CODE IS WRITTIN BY LEVIATHAN, THE CREATOR OF LOSH. 
    
    THE LICENCE IS MIT.


*/

#include <stdio.h>
#include <unistd.h>
#include <zconf.h>
int isRoot(){
    int rootCode = 0;
    if(getuid() == 0){
        rootCode = 1;
    }else{
        rootCode = 0;
    }
    return rootCode;
    
}
int main(){
    int exitCode = 0;
    if(isRoot()){
        exitCode = 0;
        printf("You are a root user! The test has now concluded.\n");
    }else{
        exitCode = 1;
        printf("You are not a root user. The test has concluded.\n");
    }
    return exitCode;
}





