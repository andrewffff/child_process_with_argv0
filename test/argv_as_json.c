/*

Compile with:
  gcc argv_as_json.c -o argv_as_json

Does what it says on the box. Nothing is escaped, so if you put
quotes and stuff in the arguments, you're gonna have a bad time.

*/

#include <stdio.h>

int main(int argc, char** argv) {
	int i;

	printf("[");

	for (i = 0; i < argc; i++) {
		printf("%s\"%s\"",
			i > 0 ? "," : "",
			argv[i]);
	}

	printf("]\n");

	return 0;
}

